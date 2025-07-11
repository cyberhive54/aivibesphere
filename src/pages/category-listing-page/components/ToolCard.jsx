import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useComparison } from '../../../components/ui/ComparisonCart';

const ToolCard = ({ tool, onViewTool }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToComparison, removeFromComparison, isInComparison } = useComparison();
  const [comparisonMessage, setComparisonMessage] = useState('');

  const handleComparisonToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInComparison(tool.id)) {
      const result = removeFromComparison(tool.id);
      if (result.success) {
        setComparisonMessage('Removed from comparison');
      }
    } else {
      const result = addToComparison(tool);
      setComparisonMessage(result.message);
    }

    // Clear message after 2 seconds
    setTimeout(() => setComparisonMessage(''), 2000);
  };

  const handleViewTool = () => {
    onViewTool(tool.id);
  };

  const getPricingDisplay = () => {
    if (tool.pricing?.type === 'free') return 'Free';
    if (tool.pricing?.type === 'freemium') return 'Freemium';
    if (tool.pricing?.startingPrice) {
      return `$${tool.pricing.startingPrice}${tool.pricing.billingCycle ? `/${tool.pricing.billingCycle}` : ''}`;
    }
    return 'Contact for pricing';
  };

  const getPricingColor = () => {
    switch (tool.pricing?.type) {
      case 'free': return 'text-success';
      case 'freemium': return 'text-accent';
      default: return 'text-text-primary';
    }
  };

  return (
    <div className="neumorphic-card bg-surface hover:shadow-elevated smooth-transition-slow group">
      <Link to={`/tool-detail-page?id=${tool.id}`} onClick={handleViewTool}>
        {/* Tool Image */}
        <div className="relative overflow-hidden rounded-t-lg h-48 bg-background">
          <Image
            src={tool.logo || tool.image}
            alt={`${tool.name} logo`}
            className={`w-full h-full object-cover smooth-transition ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-surface rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={24} className="text-primary" />
              </div>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
              {tool.category}
            </span>
          </div>

          {/* Comparison Toggle */}
          <div className="absolute top-3 right-3">
            <Button
              variant={isInComparison(tool.id) ? "primary" : "ghost"}
              onClick={handleComparisonToggle}
              iconName="GitCompare"
              className={`p-2 ${
                isInComparison(tool.id) 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
              title={isInComparison(tool.id) ? 'Remove from comparison' : 'Add to comparison'}
            />
          </div>

          {/* New Badge */}
          {tool.isNew && (
            <div className="absolute bottom-3 left-3">
              <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            </div>
          )}
        </div>

        {/* Tool Content */}
        <div className="p-4">
          {/* Tool Header */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-primary smooth-transition line-clamp-1">
              {tool.name}
            </h3>
            <p className="text-text-secondary text-sm line-clamp-2 leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Tool Stats */}
          <div className="flex items-center justify-between mb-4">
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon
                    key={star}
                    name="Star"
                    size={14}
                    className={
                      star <= Math.floor(tool.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : star <= (tool.rating || 0)
                        ? 'text-yellow-400 fill-current opacity-50' :'text-text-muted'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                {tool.rating ? tool.rating.toFixed(1) : '0.0'}
              </span>
              <span className="text-xs text-text-muted">
                ({tool.reviewCount || 0})
              </span>
            </div>

            {/* Views */}
            <div className="flex items-center space-x-1 text-text-muted">
              <Icon name="Eye" size={14} />
              <span className="text-xs">
                {tool.viewCount ? tool.viewCount.toLocaleString() : '0'}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-4">
            <span className={`text-sm font-medium ${getPricingColor()}`}>
              {getPricingDisplay()}
            </span>
          </div>

          {/* Features Preview */}
          {tool.features && tool.features.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs bg-background text-text-secondary px-2 py-1 rounded border border-border"
                  >
                    {feature}
                  </span>
                ))}
                {tool.features.length > 3 && (
                  <span className="text-xs text-text-muted">
                    +{tool.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="primary"
              fullWidth
              className="text-sm"
              onClick={(e) => {
                e.preventDefault();
                window.open(tool.websiteUrl, '_blank');
              }}
            >
              Visit Website
            </Button>
            <Button
              variant="outline"
              iconName="ExternalLink"
              className="flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                window.open(tool.websiteUrl, '_blank');
              }}
            />
          </div>
        </div>
      </Link>

      {/* Comparison Message */}
      {comparisonMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-surface border border-border rounded-lg px-4 py-2 shadow-elevated animate-scale-in z-10">
          <span className="text-sm text-text-primary">{comparisonMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ToolCard;